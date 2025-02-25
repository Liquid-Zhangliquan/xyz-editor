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
import dataset from './pointer_listener_with_different_style_point_spec.json';

describe('pointer listener with different style point', function() {
    const expect = chai.expect;

    let preparedData;
    let mapContainer;
    let poiLayer;
    let styles;
    let display;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            renderOptions: {
                preserveDrawingBuffer: true
            },
            center: {longitude: 73.044927, latitude: 20.407239},
            zoomlevel: 19,
            layers: preparedData.getLayers()
        });

        await waitForViewportReady(display);

        mapContainer = display.getContainer();

        poiLayer = preparedData.getLayers('placeLayer');
        styles = poiLayer.getStyle();
    });

    after(async function() {
        display.destroy();
        await preparedData.clear();
    });

    it('valite pointdown and up on link', async function() {
        let listener = new Listener(display, ['pointerdown', 'pointerup']);

        await click(mapContainer, 321, 311);

        let results = listener.stop();
        expect(results.pointerdown).to.have.lengthOf(1);
        expect(results.pointerdown[0]).to.deep.include({
            button: 0,
            mapX: 321,
            mapY: 311,
            type: 'pointerdown'
        });
        expect(results.pointerup).to.have.lengthOf(1);
        expect(results.pointerup[0]).to.deep.include({
            button: 0,
            mapX: 321,
            mapY: 311,
            type: 'pointerup'
        });
    });

    it('validate style', function() {
        expect(poiLayer.getStyle().styleGroups['Point'][0]).to.deep.include({
            zIndex: 0, type: 'Circle', radius: 6, fill: '#ff0000'
        });
    });

    it('set style and validate point down and up events', async function() {
        poiLayer.setStyle({
            styleGroups: {
                styles: [
                    {'zIndex': 0, 'type': 'Rect', 'width': 16, 'height': 16, 'opacity': 1, 'stroke': '#be6b65', 'strokeWidth': 16}
                    // ,
                    // {zIndex: 1, type: "Text", text: null,fill:"#ffffff"}
                ]
            },
            assign: function(feature, zoomlevel) {
                return 'styles';
            }
        });

        display.refresh(poiLayer);


        let listener = new Listener(display, ['pointerdown', 'pointerup']);
        await click(mapContainer, 321, 311);

        let results = listener.stop();
        expect(results.pointerdown).to.have.lengthOf(1);
        expect(results.pointerdown[0]).to.deep.include({
            button: 0,
            mapX: 321,
            mapY: 311,
            type: 'pointerdown'
        });
        expect(results.pointerup).to.have.lengthOf(1);
        expect(results.pointerup[0]).to.deep.include({
            button: 0,
            mapX: 321,
            mapY: 311,
            type: 'pointerup'
        });

        let colors = await getCanvasPixelColor(mapContainer, [{x: 282, y: 203}, {x: 272, y: 203}, {x: 248, y: 203}, {x: 239, y: 203}]);

        expect(colors[0]).to.equal('#ffffff');
        expect(colors[1]).to.equal('#be6b65');
        expect(colors[2]).to.equal('#be6b65');
        expect(colors[3]).to.equal('#ffffff');
    });


    it('reset style and validate', async function() {
        poiLayer.setStyle(styles);

        display.refresh(poiLayer);

        let color = await getCanvasPixelColor(mapContainer, {x: 254, y: 205});
        expect(color).to.equal('#ff0000');
    });
});
