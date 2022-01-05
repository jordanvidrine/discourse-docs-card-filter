import Component from "@ember/component";
import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";
import discourseComputed from "discourse-common/utils/decorators";
import { readOnly } from "@ember/object/computed";

export default Component.extend({
  classNameBindings: ["shouldShow:visible"],
  router: service(),
  init() {
    this._super(...arguments);
  },

  @discourseComputed("router.currentRoute.queryParams")
  shouldShow(params) {
    if (!this.siteSettings.docs_enabled) return false;
    if (this?.includedCategories?.length > 0 || this?.includedTags?.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  @discourseComputed("categories", "router.currentRoute.queryParams")
  includedCategories(categories, params) {
    let pluginCategories = this.siteSettings.docs_categories.split("|");

    let includedCategories;

    if (categories) {
      includedCategories = categories.filter(category => {
        let currentCategory;

        if (params?.category) {
          currentCategory =
            Number(params.category) === category.id ? category.id : "";
        }

        return (
          pluginCategories.indexOf(`${category.id}`) !== -1 &&
          currentCategory !== category.id
        );
      });
    }
    return includedCategories;
  },

  @discourseComputed("tags", "router.currentRoute.queryParams")
  includedTags(tags, params) {
    let pluginTags = this.siteSettings.docs_tags.split("|");

    let includedTags;

    if (tags) {
      includedTags = tags.filter(tag => {
        let currentTags = [];

        if (params?.tags) {
          currentTags.push(...params.tags.split("|"));
        }

        return (
          pluginTags.includes(`${tag.id}`) &&
          !currentTags.includes(tag.id)
        );
      });
    }

    return includedTags;
  },

  @discourseComputed()
  tagIcons() {
    let icons = {};

    settings.tag_icons.split("|").forEach(data => {
      icons[data.split(",")[0]] = data.split(",")[1];
    });

    return icons;
  },

  @discourseComputed()
  tagOrders() {
    let order = {};

    settings.tag_icons.split("|").forEach(data => {
      const arrayData = data.split(",");
      if (arrayData.length === 3) {
        order[arrayData[0]] = arrayData[2];
      }
    });

    return order;
  },

  @discourseComputed()
  categoryOrders() {
    let order = {};

    settings.category_icons.split("|").forEach(data => {
      const arrayData = data.split(",");
      if (arrayData.length === 3) {
        order[arrayData[0]] = arrayData[2];
      }
    });

    return order;
  },

  @discourseComputed()
  categoryIcons() {
    let icons = {};

    settings.category_icons.split("|").forEach(data => {
      icons[data.split(",")[0]] = data.split(",")[1];
    });

    return icons;
  }
});
