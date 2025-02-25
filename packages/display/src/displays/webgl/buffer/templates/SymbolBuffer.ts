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

import {TemplateBuffer} from './TemplateBuffer';
import {FlexArray} from './FlexArray';

export class SymbolBuffer extends TemplateBuffer {
    constructor() {
        super(false);

        this.attributes = {
            a_position: {
                data: new FlexArray(Int16Array),
                size: 2
            },
            a_size: {
                data: new FlexArray(Uint8Array),
                size: 2
            },
            a_texcoord: {
                data: new FlexArray(Uint16Array),
                size: 2
            }
        };

        this.first = 0;
        // this.first = this.attributes.a_position.data.length / this.attributes.a_position.data.size;
    }
}
