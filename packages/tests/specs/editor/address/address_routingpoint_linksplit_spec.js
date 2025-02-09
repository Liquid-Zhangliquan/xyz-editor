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
import {editorClick, waitForEditorReady} from 'editorUtils';
import {Editor} from '@here/xyz-maps-editor';
import {Map} from '@here/xyz-maps-display';
import dataset from './address_routingpoint_linksplit_spec.json';

describe('Address routing point updates by link split', function() {
    const expect = chai.expect;

    var preparedData;
    var editor;
    var display;

    var link;
    var address;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 79.61337180560229, latitude: 11.875416530928291},
            zoomlevel: 18,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {layers: preparedData.getLayers()});

        await waitForEditorReady(editor);

        link = preparedData.getFeature('linkLayer', -188823);
        address = preparedData.getFeature('paLayer', -47936);
    });

    after(async function() {
        editor.destroy();
        display.destroy();

        await preparedData.clear();
    });

    it('select Address object and validate', async function() {
        address.select();

        expect(address.getLink()).to.deep.include({
            id: link.id
        });

        address.unselect();
    });

    it('split the link, validate address connects to a new link', async function() {
        link.select();

        let linkShape = (await editorClick(editor, 400, 150)).target;
        let newLinks = linkShape.splitLink();

        address.select();

        expect(address.prop()).to.deep.include({
            routingLink: newLinks[0].id
        });

        address.unselect();
    });
});
