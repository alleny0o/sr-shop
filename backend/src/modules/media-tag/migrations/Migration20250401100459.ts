import { Migration } from '@mikro-orm/migrations';

export class Migration20250401100459 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "media_tag" add column if not exists "product_id" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "media_tag" drop column if exists "product_id";`);
  }

}
