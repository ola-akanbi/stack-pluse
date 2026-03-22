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