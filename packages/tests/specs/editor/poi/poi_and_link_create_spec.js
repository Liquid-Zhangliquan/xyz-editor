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
import {Listener, prepare} from 'utils';
import {waitForEditorReady, clean, submit} from 'editorUtils';
import {Map} from '@here/xyz-maps-display';
import {features, Editor} from '@here/xyz-maps-editor';
import dataset from './poi_and_link_create_spec.json';

describe('poi and link create', function() {
    const expect = chai.expect;

    var editor;
    var display;
    var preparedData;
    var idMaps = [];

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 80.1973, latitude: 20.82666},
            zoomlevel: 18,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });
        await waitForEditorReady(editor);
    });

    after(async function() {
        await clean(editor, idMaps);
        editor.destroy();
        display.destroy();
        await preparedData.clear();
    });

    it('start listener, validate no error is triggered', async function() {
        let listener = new Listener(editor, 'error');

        let p = new features.Place({x: 300, y: 250}, {featureClass: 'PLACE'});
        editor.addFeature(p);

        let l = new features.Navlink([{x: 200, y: 100}, {x: 200, y: 200}], {featureClass: 'NAVLINK'});
        editor.addFeature(l);

        let idMap;
        await waitForEditorReady(editor, async ()=>{
            idMap = await submit(editor);
            idMaps.push(idMap);
        });

        let results = listener.stop();
        expect(results.error).to.have.lengthOf(0);

        let objs = editor.search(display.getViewBounds());
        expect(objs).to.have.lengthOf(2);
    });
});
