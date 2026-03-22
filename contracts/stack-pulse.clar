;; StackPulse - Real-time Micro-tipping & Activity Protocol on Stacks
;; Version: 1.1.0
;;
;; StackPulse is a decentralized micro-tipping protocol built on the Stacks blockchain.
;; It enables users to send STX tips with optional messages while emitting on-chain
;; signals ("pulses") of economic activity across the network.
;;
;; The protocol provides transparent, real-time metrics such as:
;; - Total pulses (tips) sent
;; - Total transaction volume
;; - User tipping activity
;; - Platform fee accumulation
;;
;; StackPulse is designed as a lightweight social-financial primitive for:
;; - Developers
;; - Creators
;; - Open-source contributors
;;
;; Each tip represents a "pulse" - a signal of value exchange on-chain.

;; ============================================================
;; CONSTANTS & ERRORS
;; ============================================================

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-transfer-failed (err u103))
(define-constant err-not-found (err u104))

;; ============================================================
;; FEE CONFIGURATION
;; ============================================================

;; 0.5% platform fee (50 basis points)
(define-constant fee-basis-points u50)
(define-constant basis-points-divisor u10000)

;; ============================================================
;; GLOBAL STATE (Protocol Metrics)
;; ============================================================

;; Total number of pulses (tips) sent
(define-data-var total-pulses uint u0)

;; Total value transferred through the protocol
(define-data-var total-volume uint u0)

;; Total fees accumulated by the platform
(define-data-var platform-fees uint u0)

;; ============================================================
;; DATA MAPS
;; ============================================================

;; Stores all pulses (tips)
(define-map pulses
    { pulse-id: uint }
    {
        sender: principal,
        recipient: principal,
        amount: uint,
        message: (string-utf8 280),
        pulse-height: uint
    }
)

;; User activity tracking
(define-map user-pulse-count principal uint)
(define-map user-received-count principal uint)
(define-map user-total-sent principal uint)
(define-map user-total-received principal uint)

;; ============================================================
;; PRIVATE FUNCTIONS
;; ============================================================

;; Calculate platform fee using basis points
(define-private (calculate-fee (amount uint))
    (/ (* amount fee-basis-points) basis-points-divisor)
)

;; ============================================================
;; PUBLIC FUNCTIONS
;; ============================================================

;; send-pulse
;; Sends a micro-tip ("pulse") to another user with an optional message.
;; Emits an on-chain signal of value transfer.
(define-public (send-pulse (recipient principal) (amount uint) (message (string-utf8 280)))
    (let
        (
            (current-id (var-get total-pulses))
            (fee (calculate-fee amount))
            (is-owner (is-eq tx-sender contract-owner))
            (net-amount (if is-owner amount (- amount fee)))

            ;; User stats
            (sender-sent (default-to u0 (map-get? user-total-sent tx-sender)))
            (recipient-received (default-to u0 (map-get? user-total-received recipient)))
            (sender-count (default-to u0 (map-get? user-pulse-count tx-sender)))
            (recipient-count (default-to u0 (map-get? user-received-count recipient)))
        )

        ;; ----------------------------------------------------
        ;; VALIDATION
        ;; ----------------------------------------------------

        (asserts! (> amount u0) err-invalid-amount)
        (asserts! (not (is-eq tx-sender recipient)) err-invalid-amount)
        (asserts! (>= (stx-get-balance tx-sender) amount) err-insufficient-balance)

        ;; ----------------------------------------------------
        ;; TRANSFERS
        ;; ----------------------------------------------------

        ;; Send main amount to recipient
        (try! (stx-transfer? net-amount tx-sender recipient))

        ;; Send fee to contract owner (if applicable)
        (if is-owner
            true
              (try! (stx-transfer? fee tx-sender contract-owner))
        )

        ;; ----------------------------------------------------
        ;; STATE RECORDING
        ;; ----------------------------------------------------

        ;; Store pulse data
        (map-set pulses
            { pulse-id: current-id }
            {
                sender: tx-sender,
                recipient: recipient,
                amount: amount,
                message: message,
                pulse-height: stacks-block-height
            }
        )

        ;; Update user stats
        (map-set user-total-sent tx-sender (+ sender-sent amount))
        (map-set user-total-received recipient (+ recipient-received amount))
        (map-set user-pulse-count tx-sender (+ sender-count u1))
        (map-set user-received-count recipient (+ recipient-count u1))

        ;; Update global stats
        (var-set total-pulses (+ current-id u1))
        (var-set total-volume (+ (var-get total-volume) amount))

        ;; Only count fee if actually charged
        (var-set platform-fees
            (+ (var-get platform-fees) (if is-owner u0 fee))
        )

        ;; ----------------------------------------------------
        ;; EVENT EMISSION (Pulse Signal)
        ;; ----------------------------------------------------

        (print {
            event: "pulse",
            sender: tx-sender,
            recipient: recipient,
            amount: amount,
            fee: fee,
            height: stacks-block-height
        })

        (ok current-id)

;; ============================================================
;; READ-ONLY FUNCTIONS
;; ============================================================

;; Retrieve a specific pulse
(define-read-only (get-pulse (pulse-id uint))
    (map-get? pulses { pulse-id: pulse-id })
)

; Get user activity stats
(define-read-only (get-user-stats (user principal))
    {
        pulses-sent: (default-to u0 (map-get? user-pulse-count user)),
        pulses-received: (default-to u0 (map-get? user-received-count user)),
        total-sent: (default-to u0 (map-get? user-total-sent user)),
        total-received: (default-to u0 (map-get? user-total-received user))
    }
)

;; Get platform-wide metrics
(define-read-only (get-platform-stats)
    {
        total-pulses: (var-get total-pulses),
        total-volume: (var-get total-volume),
        platform-fees: (var-get platform-fees)
    }
)
;; Get total sent by a user
(define-read-only (get-user-sent-total (user principal))