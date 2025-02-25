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
import {getCanvasPixelColor, prepare} from 'utils';
import {Map} from '@here/xyz-maps-display';
import dataset from './setstylegroup_point_with_same_zindex.json';

describe('setStyleGroup point with same zIndex', function() {
    const expect = chai.expect;

    let buildingLayer;
    let paLayer;
    let display;
    let mapContainer;
    let feature;
    let building;

    before(async function() {
        let preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            renderOptions: {
                preserveDrawingBuffer: true
            },
            center: {longitude: 73.123895, latitude: 20.181738},
            zoomlevel: 18,
            layers: preparedData.getLayers()
        });
        await waitForViewportReady(display);

        mapContainer = display.getContainer();
        buildingLayer = preparedData.getLayers('buildingLayer');
        paLayer = preparedData.getLayers('paLayer');

        // get a feature
        feature = preparedData.getFeature('paLayer', '123');
        building = preparedData.getFeature('buildingLayer', '123');
    });

    after(async function() {
        display.destroy();
    });

    it('style feature with different zIndex, validate its style', async function() {
        // set style for the added feature with different zIndex, same color
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 30, 'height': 10, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 1, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });

    it('style feature with different fill color, validate its style', async function() {
        // set style for the added feature with same zIndex, different color
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 30, 'height': 10, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#ffffff'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#ffffff');
    });


    it('style feature with same zIndex 0 and fill, validate its style', async function() {
        // set style for the added feature with same zIndex and color
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 30, 'height': 10, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });


    it('style feature with same zIndex 1 and fill, validate its style', async function() {
        // set style for the added feature with same zIndex and color
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 1, 'type': 'Rect', 'width': 30, 'height': 10, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 1, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });

    it('style feature with same zIndex and fill and different offsetY, validate its style', async function() {
        // set style for the added feature with same zIndex and color, different offsetY
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 30, 'height': 10, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 0, 'type': 'Rect', 'width': 30, 'height': 10, 'offsetY': 10, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in the middle of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 400, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });

    it('style feature with same zIndex and fill and different offsetX, validate its style', async function() {
        // set style for the added feature with same zIndex and color, different offsetX
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'offsetX': 10, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in the middle of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 400, y: 300}, {x: 410, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });

    it('style feature with same zIndex and fill and different rotation, validate its style', async function() {
        // set style for the added feature with same zIndex and color, different rotation
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'rotation': 90, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });


    it('style feature with same zIndex 1 and fill and different rotation, validate its style', async function() {
        // set style for the added feature with same zIndex and color, different rotation
        paLayer.setStyleGroup(
            feature, [
                {'zIndex': 1, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 1, 'fill': '#be6b65'},
                {'zIndex': 1, 'type': 'Rect', 'width': 10, 'height': 30, 'rotation': 90, 'opacity': 1, 'fill': '#be6b65'}
            ]);

        // validate features have new style
        // get color in mid right of address
        // get color in mid bottom of address
        let colors = await getCanvasPixelColor(mapContainer, [{x: 410, y: 300}, {x: 400, y: 310}]);

        expect(colors[0]).to.equal('#be6b65');
        expect(colors[1]).to.equal('#be6b65');
    });

    it('style feature with same values, opacity is 0.5, validate its style', async function() {
        // style build as background color
        buildingLayer.setStyleGroup(
            building,
            {'zIndex': 0, 'type': 'Polygon', 'fill': '#000000', 'stroke': '#000000'}
        );

        // set style for the added feature with same values
        paLayer.setStyleGroup(
            feature, [
                // fill and opacity values makes sure alpha blending these colors will produce integer color value
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.5, 'fill': '#c06c64'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.5, 'fill': '#c06c64'}
            ]);

        // validate features have new style
        // get color in the middle of address
        let color = await getCanvasPixelColor(mapContainer, {x: 400, y: 300});

        expect(color).to.equal('#90514b');
    });

    it('style feature with different opacity, validate its style', async function() {
        // style build as background color
        buildingLayer.setStyleGroup(
            building,
            {'zIndex': 0, 'type': 'Polygon', 'fill': '#000000', 'stroke': '#000000'}
        );

        // set style for the added feature with different opacity
        paLayer.setStyleGroup(
            feature, [
                // fill and opacity values makes sure alpha blending these colors will produce integer color value
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.5, 'fill': '#ffffff'},
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.6, 'fill': '#ffffff'}
            ]);

        // validate features have new style
        // get color in the middle of address
        let color = await getCanvasPixelColor(mapContainer, {x: 400, y: 300});

        expect(color).to.equal('#cccccc');
    });

    it('style feature with different zIndex and opacity, validate its style', async function() {
        // style build as background color
        buildingLayer.setStyleGroup(
            building,
            {'zIndex': 0, 'type': 'Polygon', 'fill': '#000000', 'stroke': '#000000'}
        );

        // set style for the added feature with different opacity and zIndex
        paLayer.setStyleGroup(
            feature, [
                // fill and opacity values makes sure alpha blending these colors will produce integer color value
                {'zIndex': 0, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.5, 'fill': '#ffffff'},
                {'zIndex': 1, 'type': 'Rect', 'width': 10, 'height': 30, 'opacity': 0.6, 'fill': '#ffffff'}
            ]);

        // validate features have new style
        // get color in the middle of address
        let color = await getCanvasPixelColor(mapContainer, {x: 400, y: 300});

        expect(color).to.equal('#cccccc');
    });
});
