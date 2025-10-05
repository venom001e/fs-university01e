# Add Mandatory Question Option

## Steps to Complete

- [x] Add "mandatory" boolean field to Question model in prisma/schema.prisma
- [x] Run prisma migrate dev to create migration (completed - migration created)
- [x] Update question creation functions in lib/actions/actions.ts to handle mandatory field (default false)
- [x] Update question update function in lib/actions/actions.ts to handle mandatory field
- [x] Update submitForm function in lib/actions/actions.ts to validate mandatory questions are answered
- [x] Update Question interface in app/forms/[id]/form.tsx to include mandatory field
- [x] Add UI checkbox for mandatory option in the form editor (app/forms/[id]/form.tsx)
- [x] Update question creation calls in app/forms/[id]/form.tsx to pass mandatory value
- [ ] Test the mandatory question functionality
