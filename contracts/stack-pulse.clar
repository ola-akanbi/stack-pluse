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