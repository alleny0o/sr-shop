import { Migration } from '@mikro-orm/migrations';

export class Migration20250401084255 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "media_tag" drop constraint if exists "media_tag_variant_id_unique";`);
    this.addSql(`create table if not exists "media_tag" ("id" text not null, "variant_id" text not null, "value" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_tag_pkey" primary key ("id"), constraint media_tag_check check (value >= 1 AND value = FLOOR(value)));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_tag_variant_id_unique" ON "media_tag" (variant_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_tag_deleted_at" ON "media_tag" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "media_tag" cascade;`);
  }

}
