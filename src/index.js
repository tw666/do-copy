import select from "select";

function _doCopy(cb = () => {}) {
  let succeeded;
  try {
    succeeded = document.execCommand("copy");
  } catch (err) {
    succeeded = false;
  }
  cb(succeeded);
  return succeeded;
}

export function copyText(text) {
  const isRTL = document.documentElement.getAttribute("dir") == "rtl";
  let fakeElem = document.createElement("textarea");
  // Prevent zooming on iOS
  fakeElem.style.fontSize = "12pt";
  // Reset box model
  fakeElem.style.border = "0";
  fakeElem.style.padding = "0";
  fakeElem.style.margin = "0";
  // Move element out of screen horizontally
  fakeElem.style.position = "absolute";
  fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
  // Move element to the same position vertically
  let yPosition = window.pageYOffset || document.documentElement.scrollTop;
  fakeElem.style.top = `${yPosition}px`;

  fakeElem.setAttribute("readonly", "");
  fakeElem.value = text;
  document.body.appendChild(fakeElem);
  select(fakeElem);

  return _doCopy(() => {
    _clearSelection();
    document.body.removeChild(fakeElem);
  });
}

export function copyFromElem(target) {
  let targetElem = target;
  if (typeof target === "string") {
    targetElem = document.querySelector(target);
  }
  if (!targetElem) {
    return false;
  }
  select(targetElem);
  return _doCopy(() => {
    _clearSelection();
  });
}

function _clearSelection() {
  window.getSelection().removeAllRanges();
}