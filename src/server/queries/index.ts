import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/server/db";

/**
 * Get links with tags by user.
 * Authentication required.
 */
export const getLinksAndTagsByUser = cache(async () => {
  const currentUser = await auth();

  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  try {
    
    const linkData = await db.links.findMany({
      where: {
        creatorId: currentUser.user?.id,
      },
      include: {
        tags: true,
      },
    });

    const tagsData = await db.tags.findMany({
      where: {
        creatorId: currentUser.user?.id,
      },
    });

    return {
      limit: 99999, //currentUser.user?.limitLinks,
      links: linkData,
      tags: tagsData,
    };
  } catch (error) {
    console.error("🚧 Error while fetching links and tags:", error);
    throw error; // Propaga el error para que el componente que llama pueda manejarlo adecuadamente
  }
});

/**
 * Get only tags by user.
 * Authentication required.
 */
export const getTagsByUser = cache(async () => {
  const currentUser = await auth();

  if (!currentUser) {
    console.error("Not authenticated.");
    return null;
  }

  const tagsData = await db.tags.findMany({
    where: {
      creatorId: currentUser.user?.id,
    },
  });

  return tagsData;
});
