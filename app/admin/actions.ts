"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isGuildAdmin } from "@/lib/auth-helpers";
import {
  createPartner,
  deletePartner,
  movePartner,
  updatePageDescription,
  updatePageInformation,
  updatePartner,
} from "@/lib/db";
import { refreshDbTexts, refreshPartners } from "@/lib/discord/cache";
import {
  PAGE_DESCRIPTION_MAX,
  PAGE_INFORMATION_MAX,
  PARTNER_DESCRIPTION_MAX,
  PARTNER_NAME_MAX,
  PARTNER_TAGLINE_MAX,
  PARTNER_URL_MAX,
} from "@/lib/constants";

export interface ActionState {
  ok: boolean;
  message: string;
}

async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  const discordId = session?.user?.discordId;
  if (!discordId || !(await isGuildAdmin(discordId))) return null;
  return discordId;
}

export async function saveSiteTexts(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Kein Zugriff." };

  const description = String(formData.get("description") ?? "").trim();
  const information = String(formData.get("information") ?? "").trim();

  if (description.length > PAGE_DESCRIPTION_MAX) {
    return {
      ok: false,
      message: `Die Beschreibung darf maximal ${PAGE_DESCRIPTION_MAX} Zeichen lang sein.`,
    };
  }
  if (information.length > PAGE_INFORMATION_MAX) {
    return {
      ok: false,
      message: `Die Informationen dürfen maximal ${PAGE_INFORMATION_MAX} Zeichen lang sein.`,
    };
  }

  try {
    await updatePageDescription(description);
    await updatePageInformation(information);
  } catch (error) {
    console.error("[saveSiteTexts] Update failed:", error);
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  await refreshDbTexts();
  revalidatePath("/");
  return { ok: true, message: "Gespeichert." };
}

export async function savePartner(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Kein Zugriff." };

  const idRaw = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const discordInviteCode = String(
    formData.get("discordInviteCode") ?? ""
  ).trim();

  if (!name || !url) {
    return { ok: false, message: "Name und URL sind erforderlich." };
  }
  if (name.length > PARTNER_NAME_MAX) {
    return {
      ok: false,
      message: `Name darf maximal ${PARTNER_NAME_MAX} Zeichen lang sein.`,
    };
  }
  if (url.length > PARTNER_URL_MAX || logoUrl.length > PARTNER_URL_MAX) {
    return {
      ok: false,
      message: `URLs dürfen maximal ${PARTNER_URL_MAX} Zeichen lang sein.`,
    };
  }
  if (tagline.length > PARTNER_TAGLINE_MAX) {
    return {
      ok: false,
      message: `Tagline darf maximal ${PARTNER_TAGLINE_MAX} Zeichen lang sein.`,
    };
  }
  if (description.length > PARTNER_DESCRIPTION_MAX) {
    return {
      ok: false,
      message: `Beschreibung darf maximal ${PARTNER_DESCRIPTION_MAX} Zeichen lang sein.`,
    };
  }

  const input = {
    name,
    url,
    logoUrl,
    tagline,
    description,
    discordInviteCode: discordInviteCode || null,
  };

  try {
    if (idRaw) {
      await updatePartner(Number(idRaw), input);
    } else {
      await createPartner(input);
    }
  } catch (error) {
    console.error("[savePartner] Save failed:", error);
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  await refreshPartners();
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: idRaw ? "Partner gespeichert." : "Partner hinzugefügt." };
}

export async function deletePartnerAction(id: number): Promise<void> {
  if (!(await requireAdmin())) return;
  await deletePartner(id);
  await refreshPartners();
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function movePartnerAction(
  id: number,
  direction: "up" | "down"
): Promise<void> {
  if (!(await requireAdmin())) return;
  await movePartner(id, direction);
  await refreshPartners();
  revalidatePath("/");
  revalidatePath("/admin");
}
