Bloob.Audio = function() {};

window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"];
Bloob.Audio.context = new window["AudioContext"]();

Scarlet.log("hallo audio", Bloob.Audio.context);
