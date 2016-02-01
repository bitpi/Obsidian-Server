/**
 * MigrationStrategy
 * 
 * Copyright (C) TENDIGI, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Nick Lee <nick@tendigi.com>, June 2015
 * 
 */
 
 enum MigrationStrategy {
	 Safe,
	 Alter,
	 Drop,
	 Create,
 }
 
 export = MigrationStrategy;