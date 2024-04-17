CREATE TABLE `movies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256),
	`orignal_title` text(256),
	`release_year` integer
);
--> statement-breakpoint
CREATE INDEX `year_idx` ON `movies` (`release_year`);