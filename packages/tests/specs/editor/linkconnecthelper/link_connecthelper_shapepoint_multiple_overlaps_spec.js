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
import {Editor} from '@here/xyz-maps-editor';
import dataset from './link_connecthelper_shapepoint_multiple_overlaps_spec.json';

describe('link connect helper which has multiple overlapped shape points 1', function() {
    const expect = chai.expect;

    var editor;
    let display;
    let preparedData;

    var link2; var link3;
    var crossings;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 80.69297278785734, latitude: 16.799272986590253},
            zoomlevel: 18,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });
        await waitForEditorReady(editor);

        link2 = preparedData.getFeature('linkLayer', -189132);
        link3 = preparedData.getFeature('linkLayer', -189133);
    });

    after(async function() {
        editor.destroy();
        display.destroy();
        await preparedData.clear();
    });

    it('validate there are crossings found', function() {
        crossings = link2.checkCrossings();
        expect(crossings).to.have.lengthOf(2);
    });

    it('get crossings and connect', async function() {
        crossings = link3.checkCrossings();
        crossings.forEach((c)=>{
            c.connect();
        });

        expect(editor.info()).to.have.lengthOf(9);
    });
});
