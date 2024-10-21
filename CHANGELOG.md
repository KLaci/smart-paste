# Change Log

All notable changes to the "smart-paste" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Added

- New `openAIBaseURL` configuration option, with a default value of "https://api.openai.com/v1"
- New `modelName` configuration option to allow users to specify the AI model
- New `systemPrompt` configuration option to allow users to customize the system prompt

### Changed

- Set `compatibility` to "compatible" if `openAIBaseURL` is not the default value