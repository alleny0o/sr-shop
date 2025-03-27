// ui
import { Tooltip } from "@medusajs/ui";
import { ThumbnailBadge } from "@medusajs/icons";

// types
import { Media } from "../types";

type MediaDisplayProps = {
    media: Media;
};

export const MediaDisplay = ({ media }: MediaDisplayProps) => {
    const isVideo = media.mime_type?.startsWith("video");

    return (
        <div className="shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-fg group relative aspect-square size-full overflow-hidden rounded-[8px] cursor-pointer">
            {isVideo ? (
                <video src={media.url} className="size-full object-cover" controls muted>
                    Your browser does not support the video tag.
                </video>
            ) : (
                <>
                    <img src={media.url} alt={media.name} className="size-full object-cover" />
                    {media.is_thumbnail && (
                        <div className="absolute left-2 top-2">
                            <Tooltip content="Thumbnail">
                                <ThumbnailBadge />
                            </Tooltip>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};