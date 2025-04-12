import { Migration } from '@mikro-orm/migrations';

export class Migration20250412042407 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "option_config" add column if not exists "is_primary_option" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "option_config" drop column if exists "is_primary_option";`);
  }

}
