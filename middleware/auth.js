export function requireAuthPage (req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  else next();
}

export function requireAuthAPI(req, res, next) {
  if (!req.session.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  else next();
}