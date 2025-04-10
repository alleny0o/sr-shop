import { Migration } from '@mikro-orm/migrations';

export class Migration20250410171524 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "media" drop constraint if exists "media_file_id_unique";`);
    this.addSql(`alter table if exists "media_group" drop constraint if exists "media_group_uuid_unique";`);
    this.addSql(`create table if not exists "media_group" ("id" text not null, "uuid" text not null, "product_id" text not null, "media_tag" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_group_uuid_unique" ON "media_group" (uuid) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_group_deleted_at" ON "media_group" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "media" ("id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "is_thumbnail" boolean not null default false, "url" text not null, "media_group_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_file_id_unique" ON "media" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_media_group_id" ON "media" (media_group_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_deleted_at" ON "media" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "media" add constraint "media_media_group_id_foreign" foreign key ("media_group_id") references "media_group" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "media" drop constraint if exists "media_media_group_id_foreign";`);

    this.addSql(`drop table if exists "media_group" cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);
  }

}
