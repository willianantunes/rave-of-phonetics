import CMS from "netlify-cms-app"

import { TagsField, TagsPreview } from "./widgets/Tags"

CMS.registerWidget("tags", TagsField, TagsPreview)
