PHASE 1

Auth module

PHASE 2

AuthTokens model

Token strategy interface

MemoryTokenStorage

LocalTokenStorage

TokenStorageFacade

PHASE 3

UserSession interface

SessionStore

Session helper methods

PHASE 4

AuthService

AuthFacade

Login workflow

PHASE 5

AuthInterceptor

PHASE 6

AuthGuard

PermissionGuard

Protect routes

PHASE 7

Login page

Logout button

Permission UI directive

PHASE 8

App initialization (rehydrate session)

PHASE 9

Auto logout on inactivity

Permission directive

Header info

Preload permissions