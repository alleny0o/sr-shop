import { Migration } from '@mikro-orm/migrations';

export class Migration20250331212333 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_value" drop constraint if exists "option_value_option_id_unique";`);
    this.addSql(`alter table if exists "option_ui" add column if not exists "is_selected" boolean not null;`);

    this.addSql(`drop index if exists "IDX_option_value_option_value_id_unique";`);
    this.addSql(`alter table if exists "option_value" drop column if exists "product_variant_id";`);

    this.addSql(`alter table if exists "option_value" rename column "option_value_id" to "option_id";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_id_unique" ON "option_value" (option_id) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "option_ui" drop column if exists "is_selected";`);

    this.addSql(`drop index if exists "IDX_option_value_option_id_unique";`);

    this.addSql(`alter table if exists "option_value" add column if not exists "product_variant_id" text null;`);
    this.addSql(`alter table if exists "option_value" rename column "option_id" to "option_value_id";`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_value_id_unique" ON "option_value" (option_value_id) WHERE deleted_at IS NULL;`);
  }

}
