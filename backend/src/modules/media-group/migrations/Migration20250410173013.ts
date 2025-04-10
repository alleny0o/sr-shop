import { Migration } from '@mikro-orm/migrations';

export class Migration20250410173013 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "media_item" drop constraint if exists "media_item_file_id_unique";`);
    this.addSql(`create table if not exists "media_item" ("id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "is_thumbnail" boolean not null default false, "url" text not null, "media_group_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_item_file_id_unique" ON "media_item" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_item_media_group_id" ON "media_item" (media_group_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_item_deleted_at" ON "media_item" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "media_item" add constraint "media_item_media_group_id_foreign" foreign key ("media_group_id") references "media_group" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "media" cascade;`);

    this.addSql(`alter table if exists "media_group" alter column "media_tag" type text using ("media_tag"::text);`);
    this.addSql(`alter table if exists "media_group" alter column "media_tag" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "media" ("id" text not null, "file_id" text not null, "size" integer not null, "name" text not null, "mime_type" text not null, "is_thumbnail" boolean not null default false, "url" text not null, "media_group_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "media_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_media_file_id_unique" ON "media" (file_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_media_group_id" ON "media" (media_group_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_media_deleted_at" ON "media" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "media" add constraint "media_media_group_id_foreign" foreign key ("media_group_id") references "media_group" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "media_item" cascade;`);

    this.addSql(`alter table if exists "media_group" alter column "media_tag" type text using ("media_tag"::text);`);
    this.addSql(`alter table if exists "media_group" alter column "media_tag" set not null;`);
  }

}
