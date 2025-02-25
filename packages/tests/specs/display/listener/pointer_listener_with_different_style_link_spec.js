/*
 * Copyright (C) 2019-2021 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

import {waitForViewportReady} from 'displayUtils';
import {Listener, getCanvasPixelColor, prepare} from 'utils';
import {click} from 'triggerEvents';
import {Map} from '@here/xyz-maps-display';
import dataset from './pointer_listener_with_different_style_link_spec.json';

describe('pointer listener with different style link', function() {
    const expect = chai.expect;

    let preparedData;
    let mapContainer;
    let linkLayer;
    let styles;
    let display;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            renderOptions: {
                preserveDrawingBuffer: true
            },
            center: {longitude: 73.02577646944563, latitude: 20.52517531632165},
            zoomlevel: 19,
            layers: preparedData.getLayers()
        });

        await waitForViewportReady(display);

        mapContainer = display.getContainer();

        linkLayer = preparedData.getLayers('linkLayer');
        styles = linkLayer.getStyle();
    });

    after(async function() {
        display.destroy();
        await preparedData.clear();
    });

    it('click on link and validate pointer events', async function() {
        let listener = new Listener(display, ['pointerdown', 'pointerup']);


        await click(mapContainer, 605, 310);

        let results = listener.stop();
        expect(results.pointerdown).to.have.lengthOf(1);
        expect(results.pointerdown[0]).to.deep.include({
            button: 0,
            mapX: 605,
            mapY: 310,
            type: 'pointerdown'
        });
        expect(results.pointerup).to.have.lengthOf(1);
        expect(results.pointerup[0]).to.deep.include({
            button: 0,
            mapX: 605,
            mapY: 310,
            type: 'pointerup'
        });
    });

    it('set link style and validate pointer events on link objects', async function() {
        linkLayer.setStyle({
            styleGroups: {
                myStyles: [
                    {'zIndex': 0, 'type': 'Line', 'opacity': 1, 'stroke': '#ff0000', 'strokeWidth': 16},
                    {'zIndex': 1, 'type': 'Line', 'opacity': 1, 'stroke': '#ff00ff', 'strokeWidth': 8}
                ]
            },
            assign: function(feature, zoomlevel) {
                return 'myStyles';
            }
        });

        display.refresh(linkLayer);

        let listener = new Listener(display, ['pointerdown', 'pointerup']);

        await click(mapContainer, 322, 309);

        let results = listener.stop();
        expect(results.pointerdown).to.have.lengthOf(1);
        expect(results.pointerdown[0]).to.deep.include({
            button: 0,
            mapX: 322,
            mapY: 309,
            type: 'pointerdown'
        });
        expect(results.pointerup).to.have.lengthOf(1);
        expect(results.pointerup[0]).to.deep.include({
            button: 0,
            mapX: 322,
            mapY: 309,
            type: 'pointerup'
        });

        let colors = await getCanvasPixelColor(mapContainer, [{x: 395, y: 294}, {x: 395, y: 303}, {x: 395, y: 310}, {x: 395, y: 316}, {x: 395, y: 322}]);

        expect(colors[0]).to.equal('#ffffff');
        expect(colors[1]).to.equal('#ff0000');
        expect(colors[2]).to.equal('#ff00ff');
        expect(colors[3]).to.equal('#ff0000');
        expect(colors[4]).to.equal('#ffffff');
    });

    it('reset layer style and validate', async function() {
        linkLayer.setStyle(styles);

        display.refresh(linkLayer);


        let color = await getCanvasPixelColor(mapContainer, {x: 322, y: 309});

        expect(color).to.equal('#ff0000');
    });
});
