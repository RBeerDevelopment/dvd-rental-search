ALTER TABLE `movies` RENAME COLUMN `id` TO `katalognr`;--> statement-breakpoint
ALTER TABLE movies ADD `regie` text(256);--> statement-breakpoint
ALTER TABLE movies ADD `no_match` integer;--> statement-breakpoint
ALTER TABLE movies ADD `to_delete` integer;