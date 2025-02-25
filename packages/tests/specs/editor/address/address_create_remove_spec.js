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
import {waitForEditorReady, submit} from 'editorUtils';
import {features, Editor} from '@here/xyz-maps-editor';
import {Map} from '@here/xyz-maps-display';
import chaiAlmost from 'chai-almost';
import dataset from './address_create_remove_spec.json';

describe('add Address object and then remove', function() {
    const expect = chai.expect;

    var preparedData;
    var editor;
    var display;

    var link;
    var address;
    var paLayer;

    before(async function() {
        chai.use(chaiAlmost());
        preparedData = await prepare(dataset);

        display = new Map(document.getElementById('map'), {
            center: {longitude: 77.32831, latitude: 12.9356},
            zoomlevel: 18,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {layers: preparedData.getLayers()});

        await waitForEditorReady(editor);

        link = preparedData.getFeature('linkLayer', -188807);
        paLayer = preparedData.getLayers('paLayer');
    });

    after(async function() {
        editor.destroy();
        display.destroy();
        await preparedData.clear();
    });

    it('validate add an address object and submit', async function() {
        let idMap;
        let addr = new features.Address({x: 200, y: 300}, {featureClass: 'ADDRESS'});
        address = editor.addFeature(addr, paLayer);

        editor.undo();
        editor.redo();
        expect(address.prop('estate')).to.be.equal('CREATED');

        await waitForEditorReady(editor, async ()=>{
            idMap = await submit(editor);
        });
    });


    it('validate remove address and submit', async function() {
        address = editor.search({layers: [paLayer], rect: display.getViewBounds()})[0];

        address.remove();
        expect(address.prop('removed')).to.be.equal('HOOK');
        expect(address.prop('estate')).to.be.equal('REMOVED');

        await waitForEditorReady(editor, async ()=>{
            await submit(editor);
        });
    });
});
