browser.action.onClicked.addListener(async () => {
  const oldTabs = await browser.tabs.query({ currentWindow: true });
  const oldIds = oldTabs.map((t) => t.id);

  let homeUrl = null;
  try {
    const setting = await browser.browserSettings.homepageOverride.get({});
    if (setting && setting.value) {
      const firstUrl = setting.value.split("|")[0].trim();
      if (firstUrl && !firstUrl.startsWith("about:")) {
        homeUrl = firstUrl;
      }
    }
  } catch (e) {
    // Fall back to default new tab if the setting can't be read.
  }

  if (homeUrl) {
    await browser.tabs.create({ url: homeUrl });
  } else {
    // Default new tab page (Firefox Home) - extensions can't open
    // about:home directly, so omit the url to get the same result.
    await browser.tabs.create({});
  }

  if (oldIds.length > 0) {
    await browser.tabs.remove(oldIds);
  }
});

