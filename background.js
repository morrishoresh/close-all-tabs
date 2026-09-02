console.log("Close All Tabs: background script loaded (v3)");

browser.action.onClicked.addListener(async () => {
  console.log("Close All Tabs: button clicked");

  const oldTabs = await browser.tabs.query({});
  const oldIds = oldTabs.map((t) => t.id);
  console.log("Close All Tabs: found tabs", oldIds);

  let homeUrl = null;
  try {
    const setting = await browser.browserSettings.homepageOverride.get({});
    console.log("Close All Tabs: homepageOverride", setting);
    if (setting && setting.value) {
      const firstUrl = setting.value.split("|")[0].trim();
      if (firstUrl && !firstUrl.startsWith("about:")) {
        homeUrl = firstUrl;
      }
    }
  } catch (e) {
    console.log("Close All Tabs: homepageOverride read failed", e);
  }

  try {
    if (homeUrl) {
      await browser.tabs.create({ url: homeUrl });
    } else {
      // Default new tab page (Firefox Home) - extensions can't open
      // about:home directly, so omit the url to get the same result.
      await browser.tabs.create({});
    }
    console.log("Close All Tabs: new tab created", homeUrl || "(default new tab)");
  } catch (e) {
    console.log("Close All Tabs: tab creation failed", e);
  }

  if (oldIds.length > 0) {
    await browser.tabs.remove(oldIds);
    console.log("Close All Tabs: old tabs removed");
  }
});
