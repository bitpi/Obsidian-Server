/**
 * Obsidian Server
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, May 2015
 * 
 */


/// <reference path="../typings/tsd.d.ts" />

import Obsidian = require('./app/obsidian');
let app = new Obsidian();
app.run();

