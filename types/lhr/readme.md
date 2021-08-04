# LHR types

A set of types defining the output of a Lighthouse run.

The types should be as self contained as possible, as they're included from multiple places with disparate requirements (in a browser or in node, from running Lighthouse directly or pulling an LHR out of a database, etc).

The types are scoped and so require explicit import, but the Lighthouse project continues the practice of having these available under the `LH.Result` global type by re-exporting elsewhere.
