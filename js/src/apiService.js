'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
    function ($, config, utils, messageTpl, cards, uuidv1) {
        var botconversation = { "sessionId": "", "conversation": [] };
        class ApiHandler {

            constructor() {
                this.options = {
                    sessionId: uuidv1(),
                    lang: "en"
                };
            }

            userSays(userInput, callback) {
                callback(null, messageTpl.userplaintext({
                    "payload": userInput,
                    "senderName": config.userTitle,
                    "senderAvatar": config.userAvatar,
                    "bottomIcon": true,
                    "time": utils.currentTime(),
                    "className": 'pull-right'
                }));
            }
            askBot(userInput, callback) {
                this.userSays(userInput, callback);

                this.options.query = userInput;
                console.log('options', this.options);
                $.ajax({
                    type: "POST",
                    url: config.chatServerURL + "query?v=20150910",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + config.accessToken
                    },
                    data: JSON.stringify(this.options),
                    success: function (response) {

                        if (!botconversation.sessionId) {
                            botconversation.sessionId = response.sessionId;
                            botconversation.conversation = [];
                        } else {
                            var agentSpeech;
                            if (botconversation.sessionId != response.sessionId && !response.result.metadata.endConversation) {
                                botconversation.sessionId = response.sessionId;
                                botconversation.conversation = [];
                            } else {
                                var agentSpeech;
                                $.each(response.result.fulfillment.messages, function (key, value) {
                                    if (value.type == 0) {
                                        agentSpeech = value.speech;
                                    }
                                });
                                botconversation.conversation.push({ "user": response.result.resolvedQuery, "agent": agentSpeech });
                            }
                        }

                        if (response.result.metadata.endConversation) {
                            var customerId;
                            var customerName;
                            var contexts = response.result.contexts;

                            console.log("conversation ended");
                            console.log("contexts", contexts);
                            console.log("botconversation", botconversation);

                            $.each(contexts, function (key, value) {
                                if (value.name == "account-info") {
                                    customerId = value.parameters.number;
                                }
                                if (value.name == "customer-name") {
                                    customerName = value.parameters.firstName;
                                }
                            });

                            $.ajax({
                                type: 'POST',
                                url: config.baseurl + 'chatbot/savehistory',
                                dataType: "json",
                                data: {
                                    "customerId": customerId, "customerName": customerName, "botconversation": JSON.stringify(botconversation)
                                },
                                success: function (response) {
                                    console.log("history saved!!!")
                                }
                            });
                            botconversation = { "sessionId": "", "conversation": [] };
                            this.options.sessionId = uuidv1();
                        }

                        let isCardorCarousel = false;
                        let isImage = false;
                        let isQuickReply = false;
                        let isQuickReplyFromApiai = false;
                        let isVideo = false;
                        let videoUrl = null;
                        let isAudio = false;
                        let audioUrl = null;
                        let isList = false;
                        let resIndex = "0";
                        let isFile = false;
                        let fileUrl = null;
                        let isReceipt = false;
                        let receiptData = null;
                        let isLogOut = false;
                        let responsesSettings = {
                            "isCardorCarousel": [],
                            "isImage": [],
                            "isVideo": [],
                            "isQuickReplyFromApiai": [],
                            "isList": [],
                            "audioUrl": [],
                            "isFile": [],
                            "isReceipt": [],
                            "isQuickReply": []
                        };
                        let bottomFlag = false;
                        let logoutData = null;
                        let listData = null;
                        let login = null;
                        let isLogIn = false;
                        let webviewData = null;
                        let isWebView = false;
                        //To find Card || Carousel
                        let count = 0;
                        let hasbutton;
                        let buttons;

                        console.log(response);
                        if (response.status.code != 200) {
                            let cardHTML = cards({
                                "payload": response.status.errorDetails,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "plaintext");
                            callback(null, cardHTML);
                        } else {
                            if (response.result.fulfillment.messages) {
                                for (let i in response.result.fulfillment.messages) {

                                    bottomFlag = false;
                                    resIndex = 1;
                                    if (i > 0) {
                                        resIndex = 0;
                                    }
                                    if (i == response.result.fulfillment.messages.length - 1) {
                                        bottomFlag = true;
                                    }
                                    console.log('length', i, bottomFlag);
                                    console.log('resIndex', resIndex);
                                    if (response.result.fulfillment.messages[i].type == 0) {
                                        let cardHTML = cards({
                                            "payload": response.result.fulfillment.messages[i].speech,
                                            "senderName": config.botTitle,
                                            "senderAvatar": config.botAvatar,
                                            "time": utils.currentTime(),
                                            "responseIndex": resIndex,
                                            "bottomIcon": bottomFlag,
                                            "className": ''
                                        }, "plaintext");
                                        callback(null, cardHTML);
                                    }
                                    if (response.result.fulfillment.messages[i].type == 1) {
                                        count = count + 1;
                                        if (count == response.result.fulfillment.messages.length) {
                                            resIndex = 1;
                                        }
                                        hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                        isCardorCarousel = true;
                                        responsesSettings['isCardorCarousel'][0] = resIndex;
                                        responsesSettings['isCardorCarousel'][1] = bottomFlag;
                                    }
                                    if (response.result.fulfillment.messages[i].type == 2) {
                                        isQuickReplyFromApiai = true;
                                        responsesSettings['isQuickReplyFromApiai'][0] = resIndex;
                                        responsesSettings['isQuickReplyFromApiai'][1] = bottomFlag;
                                    }
                                    if (response.result.fulfillment.messages[i].type == 3) {
                                        isImage = true;
                                        responsesSettings['isImage'][0] = resIndex;
                                        responsesSettings['isImage'][1] = bottomFlag;
                                    }
                                    if (response.result.fulfillment.messages[i].type == 4) {

                                        console.log(response.result.fulfillment.messages[i]);
                                        //isQuickReply = (response.result.fulfillment.messages[i].payload.facebook.quick_replies.length > 0) ? true : false ;
                                        //console.log(isQuickReply);
                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.type == "video") {
                                            isVideo = true;
                                            videoUrl = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.url;
                                            responsesSettings['isVideo'][0] = resIndex;
                                            responsesSettings['isVideo'][1] = bottomFlag;
                                            //console.log(videoUrl);
                                        }

                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.type == "audio") {
                                            isAudio = true;
                                            audioUrl = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.url;
                                            //console.log(audioUrl);
                                            responsesSettings['isAudio'][0] = resIndex;
                                            responsesSettings['isAudio'][1] = bottomFlag;
                                        }
                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.type == "file") {
                                            isFile = true;
                                            fileUrl = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.url;
                                            responsesSettings['isFile'][0] = resIndex;
                                            responsesSettings['isFile'][1] = bottomFlag;
                                            //console.log(fileUrl);
                                        }
                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type == "receipt") {
                                            isReceipt = true;
                                            receiptData = response.result.fulfillment.messages[i].payload.facebook.attachment.payload;
                                            responsesSettings['isReceipt'][0] = resIndex;
                                            responsesSettings['isReceipt'][1] = bottomFlag;
                                            //console.log(isReceipt);
                                        }
                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type == "list") {
                                            console.log('list');
                                            isList = true;
                                            listData = response.result.fulfillment.messages;
                                            responsesSettings['isList'][0] = resIndex;
                                            responsesSettings['isList'][1] = bottomFlag;
                                            //console.log(isReceipt);
                                        }
                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type == 'logout') {
                                            isLogOut = true;
                                            logoutData = response.result.fulfillment.messages[i].payload.facebook.attachment.payload;
                                            console.log(isLogOut);
                                            responsesSettings['isLogOut'][0] = resIndex;
                                            responsesSettings['isLogOut'][1] = bottomFlag;
                                        }

                                        if (response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type == 'login') {
                                            login = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.elements;
                                            isLogIn = true;
                                            responsesSettings['isLogIn'][0] = resIndex;
                                            responsesSettings['isLogIn'][1] = bottomFlag;
                                        }
                                        if (['button', 'generic'].indexOf(response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type) >= 0) {
                                            console.log(JSON.stringify(response));
                                            buttons = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.buttons;
                                            for (let l = 0; l < buttons.length; l++) {
                                                if (buttons[l].type == 'web_url') {
                                                    isWebView = true;
                                                    webviewData = response.result.fulfillment.messages[i].payload.facebook.attachment.payload;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                let cardHTML = cards({
                                    "payload": response.result.fulfillment.speech,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "responseIndex": resIndex,
                                    "time": utils.currentTime(),
                                    "bottomIcon": bottomFlag,
                                    "className": ''
                                }, "plaintext");
                                callback(null, cardHTML);
                            }
                        }
                        //Carousel
                        if (isCardorCarousel) {
                            console.log(responsesSettings['isCardorCarousel']);

                            if (count == 1) {
                                console.log("count", count);
                                let cardHTML = cards({
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "responseIndex": responsesSettings['isCardorCarousel'][0],
                                    "bottomIcon": responsesSettings['isCardorCarousel'][1],
                                    "buttons": hasbutton,
                                    "className": ''
                                }, "card");
                                console.log("cardHTML", cardHTML);
                                callback(null, cardHTML);
                            }
                            else {
                                let carouselHTML = cards({
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "responseIndex": responsesSettings['isCardorCarousel'][0],
                                    "bottomIcon": responsesSettings['isCardorCarousel'][1],
                                    "buttons": hasbutton,
                                    "className": ''
                                }, "carousel");
                                callback(null, carouselHTML);
                            }
                        }
                        //Image Response
                        if (isImage) {
                            let cardHTML = cards(response.result.fulfillment.messages, "image");
                            callback(null, cardHTML);
                        }
                        //CustomPayload Quickreplies
                        if (isQuickReply) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isQuickReply'][0],
                                "bottomIcon": responsesSettings['isQuickReply'][1],
                                "className": ''
                            }, "quickreplies");
                            callback(null, cardHTML);
                        }
                        //Apiai Quickreply
                        if (isQuickReplyFromApiai) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isQuickReplyFromApiai'][0],
                                "bottomIcon": responsesSettings['isQuickReplyFromApiai'][1],
                                "className": ''
                            }, "quickreplyfromapiai");
                            callback(null, cardHTML);
                        }
                        if (isVideo) {
                            let cardHTML = cards({
                                "payload": videoUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isVideo'][0],
                                "bottomIcon": responsesSettings['isVideo'][1],
                                "className": ''
                            }, "video");
                            callback(null, cardHTML);
                        }
                        if (isAudio) {
                            let cardHTML = cards({
                                "payload": audioUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isAudio'][0],
                                "bottomIcon": responsesSettings['isAudio'][1],
                                "className": ''
                            }, "audio");
                            callback(null, cardHTML);
                        }
                        if (isFile) {
                            let cardHTML = cards({
                                "payload": fileUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isFile'][0],
                                "bottomIcon": responsesSettings['isFile'][1],
                                "className": ''
                            }, "file");
                            callback(null, cardHTML);
                        }
                        if (isList) {
                            console.log('cards calling - list');
                            let cardHTML = cards({
                                "payload": listData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "responseIndex": responsesSettings['isList'][0],
                                "bottomIcon": responsesSettings['isList'][1],
                                "time": utils.currentTime(),
                                "className": ''
                            }, "list");
                            callback(null, cardHTML);
                        }
                        if (isReceipt) {
                            let cardHTML = cards({
                                "payload": receiptData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isReceipt'][0],
                                "bottomIcon": responsesSettings['isReceipt'][1],
                                "className": ''
                            }, "receipt");
                            callback(null, cardHTML);
                        }
                        if (isLogOut) {
                            console.log("ISWEB logout:::" + $('#webchat').context.URL);
                            let cardHTML = cards({
                                "payload": logoutData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isLogOut'][0],
                                "bottomIcon": responsesSettings['isLogOut'][1],
                                "className": '',
                                "isWeb": $('#webchat').context.URL
                            }, "logout");
                            callback(null, cardHTML);
                        }
                        if (isWebView) {
                            console.log("ISWEB:::" + $('#webchat').context.URL);
                            let cardHTML = cards({
                                "payload": webviewData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "responseIndex": responsesSettings['isWebView'][0],
                                "bottomIcon": responsesSettings['isWebView'][1],
                                "className": '',
                                "isWeb": $('#webchat').context.URL
                            }, "webview");
                            callback(null, cardHTML);
                        }
                        if (isLogIn) {
                            console.log("ISWEB:::" + $('#webchat').context.URL);
                            let cardHTML = cards({
                                "payload": login,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "responseIndex": responsesSettings['isLogIn'][0],
                                "bottomIcon": responsesSettings['isLogIn'][1],
                                "time": utils.currentTime(),
                                "className": '',
                                "isWeb": $('#webchat').context.URL
                            }, "login");
                            callback(null, cardHTML);
                        }
                    },
                    error: function () {
                        callback("Internal Server Error", null);
                    }
                });
            }
        }

        return function (accessToken) {
            return new ApiHandler();
        }
    });