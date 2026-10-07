# Posting kit: "Offrez une expérience beauté chez OYA MUSE"

Everything needed to publish the reel (`out/mysalon-gift-reel.mp4`) from the MySalon.ma account.

## Caption

```text
Arrête d'offrir des fleurs 🥀
Cette fois, offrez une expérience beauté chez OYA MUSE, à Témara ✨
Manucure russe, lash lift ou brow lift : vous choisissez le soin, vous payez en ligne, elle reçoit sa carte cadeau digitale et réserve quand elle veut.

🎁 Pour offrir : écrivez « CADEAU » en DM.
😏 Vous en rêvez ? Envoyez ce reel à la bonne personne.

#idéecadeau #cartecadeau #cadeaupourelle #temara #rabat #oyamuse #manucurerusse #lashlift #browlift #mysalonma
```

The first line repeats the on-screen hook (it is what shows under the reel before "plus"). Keep the hashtags to these
few, relevant ones.

## Pinned first comment

```text
Pour offrir : écrivez CADEAU en DM 🎁 Manucure russe 120 DH · Lash lift 250 DH · Brow lift 200 DH. On s'occupe de tout : paiement en ligne, et sa carte cadeau digitale arrive sur son téléphone.
```

Post it yourself right after publishing and pin it. Check the prices with OYA MUSE first; they are also on screen
(`services.items[].price` in `src/Root.tsx`, leave a price empty to hide it).

## DM auto-reply for "CADEAU"

Set up an automated reply for the keyword **CADEAU** (Instagram automated responses in Meta Business Suite, or a tool
like ManyChat), so nobody waits:

```text
Avec plaisir 🎁 Quel soin souhaitez-vous offrir chez OYA MUSE (Témara) ?
1. Manucure russe + vernis permanent (120 DH)
2. Lash lift (250 DH)
3. Brow lift (200 DH)
Répondez avec le numéro et le prénom de la personne : on vous envoie le paiement, puis sa carte cadeau digitale.
```

Every DM that mentions a treatment is a sale: answer with the payment link, then send the card.

## Cover

- **Profile grid:** `out/cover-card.png` (the digital gift card under "Offrez une expérience beauté chez OYA
  MUSE"). Elegant on the grid, and it says what the offer is.
- `out/cover-soin.png` (the manucure russe photo under the salon's name) is the prettier alternative if you want the
  grid to show the salon's work.
- **In the feed** people see the first frame, which is already the hook ("ARRÊTE D'OFFRIR… des fleurs").
  `out/cover-hook.png` is that frame, if you prefer the hook on the grid too.

## Publishing

- **When:** Thursday to Sunday evening, around 19:00–21:30 (Morocco time), when gift ideas get planned.
- **Collab post:** invite @oyamuse.ma as a collaborator so the reel also appears on its profile and reaches its
  followers. The on-screen action stays "Écrivez « CADEAU » en DM" on MySalon.ma, so the messages come to you.
- **First hour:** reply to every comment (a short reply plus a question keeps the thread going), answer DMs fast, and
  share the reel to your Story with a "Message" sticker.
- **Re-post around gifting moments:** Saint-Valentin (14 February), Fête des mères (last Sunday of May), Aïd,
  birthdays and the end of the year. Change `reveal.names` to fit the moment (for example "Maman" first in May).
- **Another salon:** switch `partner`, `services.items` and `how.options` in `src/Root.tsx`, re-render, and post the
  same reel for another salon on the platform.

## Boosting

If you promote it, use the **Messages** objective (Instagram Direct), which matches the DM call to action. Target
Témara, Rabat and Salé (about 25 km), ages 20–45, all genders; interests such as gifts, beauty, couples and special
occasions. Start small, keep the version that brings the most "CADEAU" messages.

## What to watch

- **3-second hold rate and average watch time:** is the hook stopping the scroll?
- **Shares / sends and saves:** the strongest reach signals; the "Envoyez ce reel…" line is there for this.
- **DMs with CADEAU:** the business result.

## Next variants to test

Same reel, different first line (edit `hook` in `src/Root.tsx`):

- "Elle a déjà tout ? Offrez-lui ça."
- "Le cadeau qu'on n'oublie pas."
- "POV : vous offrez enfin un vrai cadeau."
