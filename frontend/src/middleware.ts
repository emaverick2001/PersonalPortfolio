import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/astro/server"

const isAdminRoute = createRouteMatcher(["/admin", "/admin/(.*)"])

const adminUserIds = (process.env.ADMIN_USER_IDS ?? import.meta.env.ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id: string) => id.trim())
  .filter(Boolean)

const adminEmails = (
  process.env.ADMIN_EMAIL_ALLOWLIST ??
  import.meta.env.ADMIN_EMAIL_ALLOWLIST ??
  ""
)
  .split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean)

export const onRequest = clerkMiddleware(async (auth, context, next) => {
  if (isAdminRoute(context.request)) {
    const pathname = new URL(context.request.url).pathname
    if (pathname === "/admin") {
      return context.redirect("/admin/")
    }
    const { userId, sessionClaims } = auth()
    if (!userId) {
      return context.redirect("/sign-in/")
    }

    const isAdminRole = (sessionClaims?.publicMetadata as { role?: string })?.role === "admin"
    const isUserIdAllowed = adminUserIds.includes(userId)
    let isEmailAllowed = false

    if (!isAdminRole && !isUserIdAllowed && adminEmails.length > 0) {
      const user = await clerkClient(context).users.getUser(userId)
      const primaryEmail =
        user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
          ?.emailAddress ?? user.emailAddresses[0]?.emailAddress
      const normalizedEmail = primaryEmail?.toLowerCase()
      isEmailAllowed = Boolean(normalizedEmail && adminEmails.includes(normalizedEmail))
    }

    if (!isAdminRole && !isUserIdAllowed && !isEmailAllowed) {
      return context.redirect("/admin/unauthorized/")
    }
  }

  return next()
})
