import { Migration } from '@mikro-orm/migrations';

export class Migration20250331212657 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_value_id_unique";`);
    this.addSql(`drop index if exists "IDX_option_value_option_id_unique";`);

    this.addSql(`alter table if exists "option_value" rename column "option_id" to "option_value_id";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_value_id_unique" ON "option_value" (option_value_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_option_value_option_value_id_unique";`);

    this.addSql(`alter table if exists "option_value" rename column "option_value_id" to "option_id";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_id_unique" ON "option_value" (option_id) WHERE deleted_at IS NULL;`);
  }

}
