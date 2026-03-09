import java.util.ArrayDeque;
import java.util.LinkedList;

public class PalindromeCheckerApp {
    // Node structure for a Singly Linked List
    static class Node {
        char data;
        Node next;
        Node(char data) { this.data = data; }
    }

    public static void main(String[] args) {
        // Define the input string
        String input = "level";

        // Convert string to linked list
        Node head = null, tail = null;
        for (char c : input.toCharArray()) {
            Node newNode = new Node(c);
            if (head == null) {
                head = newNode;
                tail = newNode;
            } else {
                tail.next = newNode;
                tail = newNode;
            }
        }

        // Flag to track palindrome state
        boolean isPalindrome = checkPalindrome(head);

        // Output results
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }

    public static boolean checkPalindrome(Node head) {
        if (head == null || head.next == null) return true;

        // Use Fast and Slow Pointer to find the middle
        Node slow = head;
        Node fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Reverse the second half in-place
        Node secondHalf = reverseList(slow);
        Node firstHalf = head;

        // Compare halves
        Node temp = secondHalf;
        while (temp != null) {
            if (firstHalf.data != temp.data) return false;
            firstHalf = firstHalf.next;
            temp = temp.next;
        }
        return true;
    }

    // Helper for in-place reversal
    private static Node reverseList(Node head) {
        Node prev = null;
        Node current = head;
        while (current != null) {
            Node nextNode = current.next;
            current.next = prev;
            prev = current;
            current = nextNode;
        }
        return prev;
    }
}