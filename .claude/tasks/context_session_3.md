# Context Session 3 - Code Review Feedback Fixes

**Session Start**: 2025-12-07
**Branch**: copilot/sub-pr-9
**Parent PR**: #9
**Focus Area**: Addressing code review comments from Copilot PR review

## Overview

Addressing critical security vulnerabilities and code quality issues identified in PR #9 review comments.

## Issues to Address

### 1. CRITICAL: Razorpay Secret Key Exposure (Security Vulnerability)
- **Issue**: `NEXT_PUBLIC_RAZORPAY_KEY_SECRET` prefix exposes secret to client-side
- **Impact**: Critical security vulnerability - API secret visible in browser
- **Files affected**:
  - `app/api/checkout/razorpay/create-order/route.ts:19`
  - `app/api/checkout/razorpay/verify/route.ts:41`
  - `.env.example:28`
- **Fix**: Remove `NEXT_PUBLIC_` prefix, use `RAZORPAY_KEY_SECRET` only

### 2. Hardcoded User ID Placeholder
- **Issue**: `"current-user-id"` placeholder not replaced with actual user ID
- **File**: `app/checkout/page.tsx:164`
- **Fix**: Replace with actual Clerk user ID from auth context

### 3. Memory Leak in Rate Limiting
- **Issue**: Module-level `setInterval` causes memory leaks in serverless
- **File**: `lib/rateLimit.ts:75`
- **Fix**: Add note about production Redis migration requirement

### 4. Unused Variables
- **Issue**: ESLint warnings for unused variables
- **Files**:
  - `app/api/checkout/razorpay/verify/route.ts:29` - unused `cart` and `addressId`
  - `app/api/health/route.ts:25` - unused `startTime`
- **Fix**: Remove unused variable declarations

### 5. Comment Enhancement (Resolved, but good practice)
- **Issue**: Raw body consumption pattern could be fragile
- **File**: `app/api/webhooks/razorpay/route.ts:43`
- **Status**: Already resolved in review thread
- **Action**: Verify comment exists explaining body reading pattern

## Implementation Plan

- [ ] Fix CRITICAL security issue: Remove `NEXT_PUBLIC_` prefix from Razorpay secret
  - [ ] Update `create-order/route.ts`
  - [ ] Update `verify/route.ts`
  - [ ] Update `.env.example`
  - [ ] Verify no other files use the exposed secret
- [ ] Fix hardcoded user ID in checkout page
  - [ ] Get user ID from Clerk context
  - [ ] Update create-order call
- [ ] Add production warning comment for rate limit memory leak
  - [ ] Document Redis migration requirement
  - [ ] Keep in-memory for development/testing
- [ ] Remove unused variables
  - [ ] Clean up verify/route.ts
  - [ ] Clean up health/route.ts
- [ ] Verify webhook comment (already resolved)
- [ ] Run linting and type checking
- [ ] Test checkout flow with real user
- [ ] Request code review
- [ ] Run security scan

## Progress

[Work starts here]
