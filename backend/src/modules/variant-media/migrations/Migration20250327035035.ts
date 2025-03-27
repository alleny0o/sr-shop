import { Migration } from '@mikro-orm/migrations';

export class Migration20250327035035 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "variant_media" drop constraint if exists "variant_media_file_id_unique";`);
    this.addSql(`create table if not exists "variant_media" ("id" text not null, "product_id" text not null, "variant_id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "is_thumbnail" boolean not null default false, "url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "variant_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_variant_media_file_id_unique" ON "variant_media" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_variant_media_deleted_at" ON "variant_media" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "variant_media" cascade;`);
  }

}
