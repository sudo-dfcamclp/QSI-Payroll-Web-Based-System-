<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the user_roles table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `user_roles` (
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `role_id` int(11) NOT NULL DEFAULT 'NULL',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `FK_user_roles_role` (`role_id`),
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `FK_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT `FK_user_roles_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
SQL);
    }

    /**
     * Drop the user_roles table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `user_roles`');
    }
};
