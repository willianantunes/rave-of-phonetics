import CMS from "netlify-cms-app"
import {
  NETLIFY_CMS_LOCAL_BACKEND,
  NETLIFY_CMS_MEDIA_FOLDER,
  NETLIFY_CMS_COLLECTION_BLOG_FOLDER,
  NETLIFY_CMS_BACKEND_BRANCH,
  NETLIFY_CMS_BACKEND_API_ROOT,
  NETLIFY_CMS_BACKEND_BASE_URL,
  NETLIFY_CMS_BACKEND_AUTH_ENDPOINT,
  NETLIFY_CMS_COMMIT_LABEL_PREFIX,
} from "../config/settings.js"
import { TagsField, TagsPreview } from "./widgets/Tags"
import { IdControl, IdPreview } from "./widgets/Id"

CMS.registerWidget("tags", TagsField, TagsPreview)
CMS.registerWidget("id", IdControl, IdPreview)

const backEndConfiguration =
  NETLIFY_CMS_LOCAL_BACKEND === true
    ? {
        branch: NETLIFY_CMS_BACKEND_BRANCH,
        name: "git-gateway",
        collections: [{ name: "blog", folder: NETLIFY_CMS_COLLECTION_BLOG_FOLDER }],
      }
    : {
        name: "github",
        branch: NETLIFY_CMS_BACKEND_BRANCH,
        api_root: NETLIFY_CMS_BACKEND_API_ROOT,
        base_url: NETLIFY_CMS_BACKEND_BASE_URL,
        auth_endpoint: NETLIFY_CMS_BACKEND_AUTH_ENDPOINT,
        cms_label_prefix: NETLIFY_CMS_COMMIT_LABEL_PREFIX,
      }

CMS.init({
  config: {
    local_backend: NETLIFY_CMS_LOCAL_BACKEND,
    backend: backEndConfiguration,
  },
})
