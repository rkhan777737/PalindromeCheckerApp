import java.util.Scanner; // Import for user input

/**
 * Use Case 3: Reverse String Based Palindrome Check (Dynamic)
 * * This version takes input from the user, reverses it using a loop,
 * and compares the original with the reversed version.
 */
public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // 1. Initialize Scanner to read from the keyboard
        Scanner scanner = new Scanner(System.in);

        // 2. Prompt and capture user input
        System.out.print("Enter text to check: ");
        String input = scanner.nextLine(); // Reads the whole line

        String reversed = ""; // Stores the reversed version

        // 3. Iterate from the last character to the first
        // Hint: for (int i = input.length() - 1; i >= 0; i--)
        for (int i = input.length() - 1; i >= 0; i--) {
            reversed += input.charAt(i); // Build reversed string
        }

        // 4. Compare original and reversed using equals()
        boolean isPalindrome = input.equals(reversed);

        // 5. Display the results
        System.out.println("Input text: " + input);
        System.out.println("Reversed text: " + reversed);
        System.out.println("Is it a Palindrome? : " + isPalindrome);

        // 6. Close the scanner
        scanner.close();
    }
}