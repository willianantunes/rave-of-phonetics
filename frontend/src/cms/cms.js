import CMS from "netlify-cms-app"

import { TagsField, TagsPreview } from "./widgets/Tags"
import { IdControl, IdPreview } from "./widgets/Id"

CMS.registerWidget("tags", TagsField, TagsPreview)
CMS.registerWidget("id", IdControl, IdPreview)
