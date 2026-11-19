
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_deductions table using the captured MySQL schema.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_deductions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `emp_id` bigint(20) unsigned NOT NULL,
  `client_id` bigint(20) unsigned NOT NULL,
  `deduction_type_id` bigint(20) unsigned NOT NULL,
  `payment` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `start_date` date NULL DEFAULT NULL,
  `end_date` date NULL DEFAULT NULL,
  `entry_by` bigint(20) unsigned NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ed_client` (`client_id`),
  KEY `fk_ed_deduction_type` (`deduction_type_id`),
  KEY `fk_ed_emp` (`emp_id`),
  KEY `fk_ed_entry_by` (`entry_by`),
  CONSTRAINT `fk_ed_emp`
    FOREIGN KEY (`emp_id`)
    REFERENCES `employee_master` (`emp_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_ed_entry_by`
    FOREIGN KEY (`entry_by`)
    REFERENCES `users` (`user_id`)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_ed_client`
    FOREIGN KEY (`client_id`)
    REFERENCES `client_master` (`client_id`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_ed_deduction_type`
    FOREIGN KEY (`deduction_type_id`)
    REFERENCES `deduction_types` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
)
SQL);
    }

    /**
     * Drop the employee_deductions table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_deductions`');
    }
};
