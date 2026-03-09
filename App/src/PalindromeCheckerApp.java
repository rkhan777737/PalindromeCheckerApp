public class PalindromeCheckerApp {
    public static void main(String[] args) {
        // Define the input string with spaces and mixed case
        String input = "A man a plan a canal Panama";

        // Normalize string: Remove all spaces and convert to lowercase
        // [^a-zA-Z0-9] or simple replaceAll(" ", "") can be used
        String normalized = input.replaceAll(" ", "").toLowerCase();

        boolean isPalindrome = true;

        // Compare characters from both ends using the normalized length
        for (int i = 0; i < normalized.length() / 2; i++) {

            // Compare symmetric characters
            if (normalized.charAt(i) != normalized.charAt(normalized.length() - 1 - i)) {
                isPalindrome = false;
                break;
            }
        }

        // Output results to console
        System.out.println("Input : " + input);
        System.out.println("Is Palindrome? : " + isPalindrome);
    }
}