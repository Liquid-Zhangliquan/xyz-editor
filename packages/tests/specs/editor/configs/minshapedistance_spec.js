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
import {prepare} from 'utils';
import {waitForEditorReady} from 'editorUtils';
import {Map} from '@here/xyz-maps-display';
import {features, Editor} from '@here/xyz-maps-editor';
import dataset from './minshapedistance_spec.json';

describe('set minShapeDistance', function() {
    const expect = chai.expect;

    let editor;
    let display;
    let preparedData;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 77.84172527566523, latitude: 17.450976000022266},
            zoomlevel: 19,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });

        await waitForEditorReady(editor);
    });

    after(async function() {
        editor.destroy();
        display.destroy();
    });

    it('set minShapeDistance, validate new link created', async function() {
        editor.destroy();
        editor = new Editor(display, {
            layers: preparedData.getLayers(),
            minShapeDistance: 5
        });

        await waitForEditorReady(editor, ()=>{
            display.setCenter({longitude: 77.84172527566523, latitude: 17.450976000022266});
            display.setZoomlevel(19);
        });

        let l1 = new features.Navlink([{x: 100, y: 300}, {x: 400, y: 300}, {x: 410, y: 300}], {featureClass: 'NAVLINK'});
        let l2 = new features.Navlink([{x: 100, y: 350}, {x: 400, y: 350}, {x: 418, y: 350}], {featureClass: 'NAVLINK'});
        let link1 = editor.addFeature(l1);
        let link2 = editor.addFeature(l2);

        // validate link1 has 2 shape points, 1 shape point is eleminated because minimum distance of shapes is 5 meters
        expect(link1.coord()).to.have.lengthOf(2);
        expect(link2.coord()).to.have.lengthOf(3);
    });

    it('reset minShapeDistance, validate new link created again', async function() {
        editor.destroy();
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });

        await waitForEditorReady(editor, ()=>{
            display.setCenter({longitude: 77.84172527566523, latitude: 17.450976000022266});
            display.setZoomlevel(19);
        });

        let l1 = new features.Navlink([{x: 100, y: 300}, {x: 400, y: 300}, {x: 410, y: 300}], {featureClass: 'NAVLINK'});
        let l2 = new features.Navlink([{x: 100, y: 350}, {x: 400, y: 350}, {x: 418, y: 350}], {featureClass: 'NAVLINK'});
        let l3 = new features.Navlink([{x: 100, y: 400}, {x: 400, y: 400}, {x: 405, y: 400}], {featureClass: 'NAVLINK'});
        let link1 = editor.addFeature(l1);
        let link2 = editor.addFeature(l2);
        let link3 = editor.addFeature(l3);

        // validate link1 has 3 shape points
        // validate link3 has 2 shape points, 1 shape point is eleminated because default minimum distance of shapes is 2 meters
        expect(link1.coord()).to.have.lengthOf(3);
        expect(link2.coord()).to.have.lengthOf(3);
        expect(link3.coord()).to.have.lengthOf(2);
    });
});
