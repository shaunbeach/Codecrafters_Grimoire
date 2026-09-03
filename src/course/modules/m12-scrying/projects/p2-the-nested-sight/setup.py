# A compact, offline stand-in for BeautifulSoup, with the same API you would use
# against the real library: BeautifulSoup(html, "html.parser"), .find(),
# .find_all(), .get_text(), tag["attr"] and tag.get("attr").
import sys, types
from html.parser import HTMLParser

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input",
             "link", "meta", "param", "source", "track", "wbr"}


class Tag:
    def __init__(self, name, attrs=None):
        self.name = name
        self.attrs = dict(attrs or {})
        self.contents = []
        self.parent = None

    # -- navigation ---------------------------------------------------------
    @property
    def children(self):
        return [node for node in self.contents if isinstance(node, Tag)]

    def descendants(self):
        for node in self.contents:
            if isinstance(node, Tag):
                yield node
                yield from node.descendants()

    def _matches(self, name, attrs):
        if name is not None:
            names = name if isinstance(name, (list, tuple, set)) else [name]
            if self.name not in names:
                return False
        for key, wanted in attrs.items():
            key = "class" if key == "class_" else key
            value = self.attrs.get(key)
            if value is None:
                return False
            if key == "class":
                if wanted not in str(value).split():
                    return False
            elif value != wanted:
                return False
        return True

    def find_all(self, name=None, class_=None, limit=None, recursive=True, **kwargs):
        if class_ is not None:
            kwargs["class"] = class_
        pool = self.descendants() if recursive else self.children
        found = []
        for node in pool:
            if node._matches(name, kwargs):
                found.append(node)
                if limit is not None and len(found) >= limit:
                    break
        return found

    findAll = find_all

    def find(self, name=None, class_=None, recursive=True, **kwargs):
        found = self.find_all(name, class_=class_, limit=1, recursive=recursive, **kwargs)
        return found[0] if found else None

    def select(self, selector):
        """Supports the simple 'tag', '.class' and 'tag.class' forms."""
        selector = selector.strip()
        name, _, cls = selector.partition(".")
        return self.find_all(name or None, class_=cls or None)

    # -- text ---------------------------------------------------------------
    def _strings(self):
        for node in self.contents:
            if isinstance(node, Tag):
                yield from node._strings()
            else:
                yield node

    def get_text(self, separator="", strip=False):
        parts = list(self._strings())
        if strip:
            parts = [part.strip() for part in parts if part.strip()]
        return separator.join(parts)

    getText = get_text

    @property
    def text(self):
        return self.get_text()

    @property
    def string(self):
        parts = [part for part in self._strings() if part.strip()]
        return parts[0] if len(parts) == 1 else None

    # -- attributes ---------------------------------------------------------
    def __getitem__(self, key):
        return self.attrs[key]

    def get(self, key, default=None):
        return self.attrs.get(key, default)

    def has_attr(self, key):
        return key in self.attrs

    def __repr__(self):
        rendered = "".join(f' {k}="{v}"' for k, v in self.attrs.items())
        return f"<{self.name}{rendered}>{self.get_text()}</{self.name}>"

    __str__ = __repr__


class _Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Tag("[document]")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Tag(tag, dict(attrs))
        node.parent = self.stack[-1]
        self.stack[-1].contents.append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        node = Tag(tag, dict(attrs))
        node.parent = self.stack[-1]
        self.stack[-1].contents.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].name == tag:
                del self.stack[index:]
                return

    def handle_data(self, data):
        self.stack[-1].contents.append(data)


def BeautifulSoup(markup, features="html.parser", **kwargs):
    builder = _Builder()
    builder.feed(markup)
    builder.close()
    return builder.root


_module = types.ModuleType("bs4")
_module.BeautifulSoup = BeautifulSoup
_module.Tag = Tag
sys.modules["bs4"] = _module

NEWS_HTML = """<!doctype html>
<html>
  <head><title>The Daily Byte</title></head>
  <body>
    <h1 id="masthead">The Daily Byte</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <div class="stories">
      <article class="story featured">
        <h2 class="headline">Python turns 35</h2>
        <p class="summary">The language nobody expected to last is still growing.</p>
        <a class="more" href="/news/python-35">Read more</a>
      </article>
      <article class="story">
        <h2 class="headline">Local developer discovers f-strings</h2>
        <p class="summary">"I have wasted years," they said.</p>
        <a class="more" href="/news/f-strings">Read more</a>
      </article>
      <article class="story">
        <h2 class="headline">Semicolons found in Python file</h2>
        <p class="summary">Police are treating the incident as suspicious.</p>
        <a class="more" href="/news/semicolons">Read more</a>
      </article>
    </div>
    <footer><a href="/contact">Contact</a></footer>
  </body>
</html>
"""

EMPTY_HTML = "<html><body><h1>Nothing here</h1></body></html>"
