;; auth.clar
;; Core domain logic for bitstack
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_FOUND (err u101))
(define-data-var admin principal tx-sender)
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) ERR_UNAUTHORIZED)
    ;; avoiding as-contract syntax for clarity 4 compliance
    (var-set admin new-admin)
