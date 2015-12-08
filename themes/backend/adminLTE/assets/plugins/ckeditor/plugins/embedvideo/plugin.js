'use strict';

CKEDITOR.plugins.add('embedvideo',
    {
        init: function (editor) {

            editor.addCommand('embedVideoDialog', new CKEDITOR.dialogCommand('embedVideoDialog'));

            editor.ui.addButton('Video',
                {
                    label: 'Video',
                    command: 'embedVideoDialog',
                    icon: CKEDITOR.plugins.getPath('embedvideo') + 'ic_embedvideo.png'
                });

            CKEDITOR.dialog.add('embedVideoDialog', function (editor) {
                var embed_code_default = '';
                var video_ratio_default = '';

                // Get select element
                var element = editor.getSelection().getStartElement();
                if (element) {
                    element = element.getAscendant('div', true);
                }

                // If element already exist
                if (element && element.getName() == 'div') {
                    var element_class = element.getAttribute('class');
                    if(element_class == 'embed-responsive embed-responsive-4by3'
                        || element_class == 'embed-responsive embed-responsive-16by9'){

                        // Get iframe src
                        embed_code_default = decodeURIComponent(element.getChildren().$[0].getAttribute('data-cke-realelement'));

                        // Get video ratio
                        if (element_class == 'embed-responsive embed-responsive-4by3') {
                            video_ratio_default = '4';
                        } else if (element_class == 'embed-responsive embed-responsive-16by9') {
                            video_ratio_default = '';
                        }

                        // Reselect the elment
                        editor.getSelection().selectElement(element);
                    }
                }

                // Display dialog
                return {
                    title: 'Embed Video Properties',
                    minWidth: 400,
                    minHeight: 200,
                    contents: [
                        {
                            id: 'general',
                            label: 'Settings',
                            elements: [
                                {
                                    type: 'textarea',
                                    id: 'embedCode',
                                    label: 'Embed Code',
                                    validate: CKEDITOR.dialog.validate.notEmpty('The Embed Code cannot be empty.'),
                                    required: true,
                                    default: embed_code_default,
                                    setup: function (element) {
                                        this.setValue(element.getHtml());
                                    },
                                    commit: function (data) {
                                        data.embedCode = this.getValue();
                                    }
                                },
                                {
                                    type: 'select',
                                    id: 'videoRatio',
                                    label: 'Video Ratio',
                                    items: [
                                        [' 16:9 ', ''],
                                        [' 4:3 ', '4']
                                    ],
                                    default: video_ratio_default,
                                    commit: function (data) {
                                        data.videoRatio = this.getValue();
                                    }
                                }
                            ]
                        }
                    ],
                    onOk: function () {
                        var dialog = this,
                            data = {},
                            embed = editor.document.createElement('div');

                        this.commitContent(data);

                        // Check video ratio to insert bootstrap embed responsive class
                        if (data.videoRatio == '4') {
                            embed.setAttribute('class', 'embed-responsive embed-responsive-4by3');
                        } else {
                            embed.setAttribute('class', 'embed-responsive embed-responsive-16by9');
                        }

                        // Set inner html = embed code
                        embed.setHtml(data.embedCode);
                        editor.insertElement(embed);
                    }
                };
            });
        }
    });
