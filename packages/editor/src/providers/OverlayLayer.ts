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

import {providers, layers} from '@here/xyz-maps-core';
import OverlayStyles from '../styles/OverlayStyles';
import InternalEditor from '../IEditor';


export class OverlayProvider extends providers.LocalProvider {
    id: string;
    _e: () => InternalEditor;
    constructor(options = {}) {
        (<any>options).name = 'EOP';
        super(options);
        this.id = 'EOP-' + this.id;
    }
};

export const createOverlayLayer = (iEdit: InternalEditor): layers.TileLayer => {
    const provider = new OverlayProvider();

    provider._e = () => iEdit;

    return new layers.TileLayer({
        name: 'EditorOverlay',
        min: 1,
        max: 28,
        styles: new OverlayStyles(),
        provider: provider
    });
};
