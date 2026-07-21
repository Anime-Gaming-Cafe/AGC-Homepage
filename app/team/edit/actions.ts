"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isStaff } from "@/lib/auth-helpers";
import { upsertTeamProfile } from "@/lib/db";
import { refreshTeamProfiles } from "@/lib/discord/cache";
import { BACK_DESC_MAX, FRONT_DESC_MAX } from "@/lib/constants";

export interface SaveProfileState {
  ok: boolean;
  message: string;
}

export async function saveProfile(
  _prevState: SaveProfileState,
  formData: FormData
): Promise<SaveProfileState> {
  const session = await auth();
  const discordId = session?.user?.discordId;
  if (!discordId || !(await isStaff(discordId))) {
    return { ok: false, message: "Kein Zugriff." };
  }

  const frontDesc = String(formData.get("frontdesc") ?? "").trim();
  const backDesc = String(formData.get("backdesc") ?? "").trim();

  if (frontDesc.length > FRONT_DESC_MAX) {
    return {
      ok: false,
      message: `Die Vorderseite darf maximal ${FRONT_DESC_MAX} Zeichen lang sein.`,
    };
  }
  if (backDesc.length > BACK_DESC_MAX) {
    return {
      ok: false,
      message: `Die Rückseite darf maximal ${BACK_DESC_MAX} Zeichen lang sein.`,
    };
  }

  try {
    await upsertTeamProfile(discordId, frontDesc, backDesc);
  } catch (error) {
    console.error("[saveProfile] Upsert failed:", error);
    return { ok: false, message: "Speichern fehlgeschlagen. Bitte später erneut versuchen." };
  }

  await refreshTeamProfiles();
  revalidatePath("/");
  return { ok: true, message: "Profil gespeichert." };
}
