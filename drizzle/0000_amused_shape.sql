CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`topic` text NOT NULL,
	`status` text DEFAULT 'pending',
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`year` text NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`description` text,
	`icon` text,
	`technologies` text
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` text,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`project_type` text,
	`budget` text,
	`timeline` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'unread',
	`recruitment` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`tools` text NOT NULL,
	`image` text NOT NULL,
	`year` integer NOT NULL,
	`role` text NOT NULL,
	`link` text,
	`github` text,
	`display_order` integer DEFAULT 0,
	`content_blocks` text DEFAULT '[]',
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `site_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`expertise` text,
	`icon` text NOT NULL,
	`level` integer DEFAULT 0,
	`category` text DEFAULT 'other',
	`color` text NOT NULL,
	`display_order` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `stats` (
	`date` text PRIMARY KEY NOT NULL,
	`visits` integer DEFAULT 0,
	`message_count` integer DEFAULT 0,
	`subscriber_count` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `stored_files` (
	`id` integer PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`data` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` text,
	`verified` integer DEFAULT 0,
	`verification_token` text,
	`token_expires` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`company` text,
	`content` text NOT NULL,
	`avatar` text
);
